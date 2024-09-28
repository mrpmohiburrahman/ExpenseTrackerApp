// components/modals/EditDeleteModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '@constants/Colors';
import { validateTransactionInput } from '@utils/validateTransactionInput';
import { Button } from 'react-native-paper';

interface EditDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; date: string; amount: number }) => void;
  onDelete: () => void;
  initialData: {
    name: string;
    date: string;
    amount: number;
  } | null;
  title: string;
  placeholderName: string;
  placeholderDate: string;
  placeholderAmount: string;
}

const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
  title,
  placeholderName,
  placeholderDate,
  placeholderAmount,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDate(initialData.date);
      setAmount(initialData.amount.toString());
    }
  }, [initialData]);

  const handleSave = () => {
    const error = validateTransactionInput(name, date, amount);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    onSave({
      name,
      date,
      amount: parseFloat(amount),
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TextInput
                placeholder={placeholderName}
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
              />
              <TextInput
                placeholder={placeholderDate}
                value={date}
                onChangeText={setDate}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
              />
              <TextInput
                placeholder={placeholderAmount}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
              />
              <View style={styles.modalButtonContainer}>
                <Button mode="contained" onPress={handleSave} textColor="white">
                  save
                </Button>
                <Button mode="contained" onPress={onDelete} textColor="white" buttonColor="maroon">
                  Delete
                </Button>

                <Button mode="contained" onPress={onClose} textColor="white" buttonColor="grey">
                  Cancel
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditDeleteModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.text,
  },
  input: {
    color: Colors.text,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  modalButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
