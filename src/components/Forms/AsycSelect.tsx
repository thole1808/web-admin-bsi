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
    onChange?: (selectedOption: Option | null) => void;
}

const AsyncSelectComponent: React.FC<AsyncSelectProps> = ({
    placeholder,
    loadOptions,
    optionLabel = 'name',
    optionValue = 'id',
    value,
    onChange
}) => {
    return (
        <div className="async-select-container">
            <AsyncSelect
                placeholder={placeholder || 'Select option...'}
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={value}
                onChange={(selectedOption) => {
                    if (onChange) {
                        onChange(selectedOption);
                    }
                }}
                getOptionLabel={(e: Option) => e[optionLabel]}
                getOptionValue={(e: Option) => e[optionValue]}
            />
        </div>
    );
};

export default AsyncSelectComponent;
