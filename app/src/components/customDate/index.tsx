import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from './styles';

interface CustomDatePickerProps {
  value: string | null; 
  onValueChange: (date: string) => void; // Função para atualizar o valor da data
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onValueChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showDatePicker = () => {
    setIsVisible(true);
  };

  const hideDatePicker = () => {
    setIsVisible(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString('pt-BR');
    onValueChange(formattedDate);
    hideDatePicker();
  };
  

  return (
      <>
        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
          <Text style={styles.dateText}>{value || 'Selecione uma data'}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          themeVariant="light"
        />
      </>
  );
};

export default CustomDatePicker;
