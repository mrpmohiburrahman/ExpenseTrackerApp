// components/modals/AddModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@constants/Colors';
import moment from 'moment';
import { validateTransactionInput } from '@utils/validateTransactionInput';

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; date: string; amount: number }) => void;
  title: string;
  placeholderName: string;
  placeholderAmount: string;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onClose, onAdd, title, placeholderName, placeholderAmount }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleAdd = () => {
    const error = validateTransactionInput(name, date, amount);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    onAdd({
      name,
      date,
      amount: parseFloat(amount),
    });
    // Reset fields
    setName('');
    setDate(moment().format('YYYY-MM-DD'));
    setAmount('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: Colors.text }]}>{title}</Text>
          <TextInput
            placeholder={placeholderName}
            value={name}
            onChangeText={setName}
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
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={{ color: Colors.text }}>{date}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(moment(selectedDate).format('YYYY-MM-DD'));
                }
              }}
            />
          )}
          <View style={styles.modalButtonContainer}>
            <Button title="Add" onPress={handleAdd} />
            <Button
              title="Cancel"
              onPress={() => {
                onClose();
                setShowDatePicker(false);
                // Reset fields
                setName('');
                setDate(moment().format('YYYY-MM-DD'));
                setAmount('');
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddModal;

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
  dateInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  modalButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
