
import { Button as ButtonComponent, Text, IButtonProps } from 'native-base'

type Props = {
    title: string;
    variant?: 'solid' | 'outline'
}

type ButtonProps = Props & IButtonProps

export function Button({ title, variant = 'solid', ...rest }: ButtonProps) {
    return (
        <ButtonComponent
            w='full'
            h={14}
            mb={4}
            rounded='sm'
            bg={variant === 'outline' ? 'transparent' : 'green.700'}
            borderWidth={variant === 'outline' ? 1 : 0}
            borderColor={variant === 'outline' ? 'green.500' : 'transparent'}
            _pressed={{
                bg: variant === 'outline' ? 'gray.500' : 'green.500'
            }}
            {...rest}
        >
            <Text
                color='white'
            >
                {title}
            </Text>
        </ButtonComponent>
    )
}