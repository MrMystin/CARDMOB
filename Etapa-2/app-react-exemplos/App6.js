import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, Alert } from 'react-native';

const BASE_URL = 'http://10.81.205.40:3000';

export default function App() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [quant, setQuant] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuant, setEditQuant] = useState('');

  const [loading, setLoading] = useState(false);

  // Buscar
  const fetchCompras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/compras`);
      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCompras();
  }, [])

  // Create
  const addItem = async () => {
    if (name.trim() === '' || quant.trim() === '' ) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name.trim(), quant: quant.trim()}),
      });
      if (response.ok) {
        await fetchCompras();
        setName('');
        setQuant('');
      }
      else {
        console.error('Failed to add item:', response.status);
      }
    } 
    catch (error) {
      console.error('Error adding item:', error);
    }

  }

  // Update
  const updateItem = async (id) => {
    try {
      if (editName.trim() === '' || editQuant.trim() === '' ) {
        return;
      }
      const response = await fetch(`${BASE_URL}/compras/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: editName.trim(), quant: editQuant.trim()}),
      });
      if (response.ok) {
        await fetchCompras();
        setEditItemId(null);
        setEditName('');
        setEditQuant('');
      }
      else {
        console.error('Failed to update item:', response.status);
      }
    }
    catch (error) {
      console.error('Error updating item:', error)
    }

  }

  // Delete
  const deleteItem = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/compras/${id}`, {
                method: 'DELETE'
              });
              if (response.ok) {
                await fetchCompras();
              }
              else {
                console.error('Failed to delete item:', response.status);
              }
            }
            catch (error) {
              console.error('Error deleting item:', error);
            }
          }, 
        }
      ],
      { cancelable: true }
    );
  };

  // Read
  const renderItem = ({item}) => {
    if (item.id != editItemId) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.quant}</Text>
          <View style={styles.buttons}>
            <Button title='Edit' onPress={() => {setEditItemId(item.id), setEditName(item.name), setEditQuant(item.quant);}}></Button>
            <Button title='Delete' onPress={() => {deleteItem(item.id)}}></Button>
          </View>
        </View>
      );

    } else {
      return (
        <View style={styles.item}>
          <TextInput 
            style={styles.editInput}
            onChangeText={setEditName}
            value={editName}
            autoFocus
          />
          <TextInput 
            style={styles.editInput}
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setEditQuant(numericText);
            }}
            value={editQuant}
            autoFocus
          />
          <Button title='Update' onPress={() => updateItem(item.id)}></Button>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder='Enter name'
      />
      <TextInput 
        style={styles.input}
        keyboardType="numeric"
        value={quant}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, '');
          setQuant(numericText);
        }}
        placeholder='Enter amount'
      />
      <Button 
        title='Add Item'
        onPress={addItem}
      />
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  text: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  itemText: {
    flex: 1,
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
  },
  editInput: {
    flex: 1,
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  }
});