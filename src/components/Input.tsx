import { Input as InputComponent, IInputProps, FormControl } from 'native-base'

type Props = {
    errorMessage?: string | null
}

type InputProps = Props & IInputProps

export function Input({ errorMessage, isInvalid, ...rest }: InputProps) {

    const isInputInvalid = !!errorMessage || isInvalid

    return (
        <FormControl
            isInvalid={isInputInvalid}
            mb={4}
        >
            <InputComponent
                bg="gray.700"
                h={14}
                px={4}
                borderWidth={0}
                fontSize="md"
                color="white"
                fontFamily="body"
                placeholderTextColor="white"
                _focus={{
                    borderWidth: 1,
                    borderColor: 'green.500'
                }}
                _invalid={{
                    borderWidth: 1,
                    borderColor: 'red.500'
                }}
                {...rest}
            />
            <FormControl.ErrorMessage>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}