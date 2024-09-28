// components/modals/FilterModal.tsx
import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors } from 'App/constants/Colors';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedMonth: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  monthOptions: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  selectedMonth,
  setSelectedMonth,
  monthOptions,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Month</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={itemValue => setSelectedMonth(itemValue)}
                style={styles.picker}
                mode="dropdown">
                {monthOptions.map(month => (
                  <Picker.Item key={month} label={moment(month, 'YYYY-MM').format('MMMM YYYY')} value={month} />
                ))}
              </Picker>
              <View style={styles.modalButtonContainer}>
                <Button title="Apply" onPress={() => onApply(selectedMonth)} />
                <Button title="Cancel" onPress={onClose} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;

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
  picker: {
    height: 200,
    width: '100%',
  },
  modalButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
