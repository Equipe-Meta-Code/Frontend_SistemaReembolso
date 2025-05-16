import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { createStyles } from './styles';
import { themas } from '../../global/themes';
import { useTheme } from '../../context/ThemeContext';

interface CustomDropdownProps {
  data: { label: string; value: string }[]; // Dados do dropdown
  placeholder: string; // Texto do placeholder
  value: string | null; // Valor selecionado
  onValueChange: (value: string) => void; // Função para atualizar o valor selecionado
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  placeholder,
  value,
  onValueChange,
}) => {
  const { theme } = useTheme();
  const styles = createStyles (theme);
  const [isFocus, setIsFocus] = useState(false);

  return (
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: theme.colors.blue }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onValueChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? theme.colors.blue : theme.colors.black}
            name="Safety"
            size={20}
          />
        )}
      />
  );
};

export default CustomDropdown;
