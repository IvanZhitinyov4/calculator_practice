import './App.css';
import {useState, useEffect} from "react";
import {Box, Text, Button} from '@chakra-ui/react'

function App() {
    // Текущее вычисление в виде строки.
    const [calculation, setCalculation] = useState('0');

    /**
     * Этот эффект добавляет обработчик события keydown к окну при монтировании компонента.
     * Обработчик управляет числовым вводом, основными арифметическими операциями и некоторыми управляющими клавишами.
     */

    useEffect(() => {
        function handleKeyDown(event){
            const key = event.key;
            if (!isNaN(key)){
                setCalculation(prev =>prev ==='0'? key : prev + key);
            }
            else if(['+', '-', '*', '/'].includes(key)){
                setCalculation(prev => prev + key);
            }
            else if(key ==='Enter') {
                setCalculation(prev => calculate(prev).toString());
            }
            else if (key === 'Backspace'){
                setCalculation(prev => prev.length > 1 ? prev.slice(0, - 1) : '0');
            }
            else if(key === 'Escape' || key === 'c' || key === 'C'){
                setCalculation('0');
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function NumberButtons(props) {
        const numButtons = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(
            number => {
                return (
                    <Button onClick={
                        (f) => {
                            if (props.data === '0' || props.data === '' || props.data === 'ERROR')
                                props.onClick(f.target.innerHTML);
                            else
                                props.onClick(props.data + f.target.innerHTML);
                        }
                    } key={number} variant="calculatorButton">{number}
                    </Button>
                )
            }
        )
        return (
            <Box display="flex" flexWrap="wrap" justifyContent="center" w="90%">
                {numButtons}
                <Button onClick={
                    (f) => {
                        if (props.data === '0' || props.data === '' || props.data === 'ERROR')
                            props.onClick(f.target.innerHTML);
                        else
                            props.onClick(props.data + f.target.innerHTML);
                    }
                } variant="calculatorButton">0
                </Button>
            </Box>
        )
    }

    function OperationButtons(props) {
        const operationButtons = Array.from(['+', '-', '*', '/']).map(
            operation => {
                return (
                    <Button onClick={
                        (f) => {
                            const lastNumber = props.data[props.data.length - 1];
                            if (!isNaN(Number(lastNumber)))
                                props.onClick(props.data + f.target.innerHTML);
                        }
                    }
                            key={operation} variant="calculatorButton" bg="#FED7D7">{operation}
                    </Button>
                )
            }
        )
        return (
            <Box display="flex" flexDirection="column">{operationButtons}</Box>
        )

    }

    /**
     * Эта функция вычисляет результат входной строки.
     * Она поддерживает сложение, вычитание, умножение и деление.
     * @param {string} input - Вычисление для выполнения.
     * @returns {number} Результат вычисления.
     */

    function calculate(input) {
        let numbers = input.split(/\+|\-|\*|\//g);
        let operations = input.replace(/[0-9]|\./g, "").split("");
        let divideAndMultiply = ["*", "/"];
        let addAndSubtract = ["+", "-"];

        divideAndMultiply.forEach(function(operator) {
            let operatorIndex = operations.indexOf(operator);
            while (operatorIndex !== -1) {
                numbers.splice(operatorIndex, 2, operate(numbers[operatorIndex], numbers[operatorIndex + 1], operator));
                operations.splice(operatorIndex, 1);
                operatorIndex = operations.indexOf(operator);
            }
        });

        addAndSubtract.forEach(function(operator) {
            let operatorIndex = operations.indexOf(operator);
            while (operatorIndex !== -1) {
                numbers.splice(operatorIndex, 2, operate(numbers[operatorIndex], numbers[operatorIndex + 1], operator));
                operations.splice(operatorIndex, 1);
                operatorIndex = operations.indexOf(operator);
            }
        });

        return numbers[0];

        /**
         * Эта функция выполняет основную арифметическую операцию над двумя числами.
         * @param {number} a - Первое число.
         * @param {number} b - Второе число.
         * @param {string} operation - Выполняемая операция. Одна из "+", "-", "*", или "/".
         * @returns {number} Результат операции.
         */

        function operate(a, b, operation) {
            a = Number(a);
            b = Number(b);
            switch (operation) {
                case "+":
                    return a + b;
                case "-":
                    return a - b;
                case "*":
                    return a * b;
                case "/":
                    if (b === 0) {
                        return 'ERROR';
                    } else {
                        return a / b;
                    }
                default:
                    return 'ERROR';
            }
        }
    }


    function EqualButton(props) {
        return (
            <Button onClick={
                (f) => {
                    try {
                        setCalculation(calculate(props.data).toString());
                    }
                    catch(exception) {
                        setCalculation('ERROR');
                    }
                }
            } key='=' variant="calculatorButton" bg="#FED7D7" >=

            </Button>
        )
    }

    function ClearButton(props) {
        return (
            <Button onClick={
                (f) => {
                    props.onClick('0');
                }
            } key='C' variant="calculatorButton" bg="#FED7D7" >C

            </Button>
        )
    }

    function DeleteLastButton(props) {
        return (
            <Button onClick={
                (f) => {
                    if (props.data.length > 1)
                        props.onClick(props.data.substring(0, props.data.length - 1));
                    else
                        props.onClick('0');
                }
            } key='←'variant="calculatorButton" bg="#FED7D7" >←
            </Button>
        )
    }

    function PointButton(props) {
        return (
            <Button onClick={
                (f) => {
                    if (props.data === '0' || props.data === '' || props.data === 'ERROR')
                        props.onClick('0.');
                    else
                        props.onClick(props.data + '.');
                }
            } key='.' variant="calculatorButton" bg="#FED7D7" >.
            </Button>
        )
    }

    return (
        <div className="App">
            <Box display ="flex" flexDirection="column" justifyContent="center" alignItems="center" h="100vh">
                <Box display="flex" gap="15px" flexDirection="column" justifyContent="center" alignItems="center" w="200px">
                    <Box display="flex" justifyCoontent="between" w="150%">
                        <Text display="flex" justifyContent="start" alignItems="center" w="100%" h="38px" px="10px"
                              borderRadius="8px" marginTop="10px" fontWeight="semiBold" overflow="auto" bg="gray.100">{calculation}</Text>
                    </Box>
                    <Box display="flex" w="150%">
                        <NumberButtons data={calculation} onClick={setCalculation} />
                        <Box display="flex" flexDirection="column">
                            <OperationButtons data={calculation} onClick={setCalculation} />
                        </Box>
                        <Box display="flex" flexDirection="column">
                            <ClearButton onClick={setCalculation} />
                            <DeleteLastButton data={calculation} onClick={setCalculation} />
                            <PointButton data={calculation} onClick={setCalculation} />
                            <EqualButton data={calculation} onClick={setCalculation} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default App;