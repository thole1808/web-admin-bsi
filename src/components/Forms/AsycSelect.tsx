import React from 'react';
import AsyncSelect from 'react-select/async';

interface Option {
    [key: string]: any;
}

interface AsyncSelectProps {
    placeholder?: string;
    loadOptions: (inputValue: string) => Promise<Option[]>;
    optionLabel?: string;
    optionValue?: string;
    value?: Option | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    onChange?: (selectedOption: Option | null) => void;
}

const AsyncSelectComponent: React.FC<AsyncSelectProps> = ({
    placeholder,
    loadOptions,
    optionLabel = 'name',
    optionValue = 'id',
    value,
    size = 'sm',
    disabled = false,
    onChange
}) => {
    return (
        <div className="async-select-container">
            <AsyncSelect
                className={`text-${size}`}
                placeholder={placeholder || 'Select option...'}
                cacheOptions
                defaultOptions={true}
                loadOptions={loadOptions}
                value={value}
                onChange={(selectedOption) => {
                    if (onChange) {
                        onChange(selectedOption);
                    }
                }}
                getOptionLabel={(e: Option) => e[optionLabel]}
                getOptionValue={(e: Option) => e[optionValue]}
                isDisabled={disabled}
            />
        </div>
    );
};

export default AsyncSelectComponent;
