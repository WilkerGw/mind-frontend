import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchableSelect.module.css';
import { ChevronDown } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, displayKey, searchKeys }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option._id === value);
      setInputValue(selectedOption ? selectedOption[displayKey] : '');
    } else {
      setInputValue('');
    }
  }, [value, options, displayKey]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };
  
  const handleSelectOption = (option) => {
    onChange(option._id);
    setInputValue(option[displayKey]);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option => {
    const searchTerm = inputValue.toLowerCase();
    return searchKeys.some(key => 
      String(option[key]).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={styles.input}
        />
        <ChevronDown className={styles.chevron} />
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li key={option._id} onClick={() => handleSelectOption(option)} className={styles.optionItem}>
                {option[displayKey]} 
                <span className={styles.optionDetail}>{option[searchKeys[1]]}</span>
              </li>
            ))
          ) : (
            <li className={styles.noOptions}>Nenhuma opção encontrada</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;