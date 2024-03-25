# Класс арифметической дроби (Fraction) на JavaScript

![image](https://github.com/wAkExGOD/arithmetic-fraction-class/assets/52173833/ea756283-b942-4542-b5bf-36a28d60753e)

Этот проект представляет собой реализацию класса арифметической дроби на JavaScript.
Класс Fraction содержит методы для выполнения операций сложения, вычитания, умножения и деления дробей.

## Использование

Для создания дроби используйте следующий синтаксис:
```javascript
const a = new Fraction(1, 3);
```

Доступные методы:
- `add(otherFraction)`: Сложение дробей.
- `subtract(otherFraction)`: Вычитание дробей.
- `multiply(otherFraction)`: Умножение дробей.
- `divide(otherFraction)`: Деление дробей.

Пример использования:
```javascript
const a = new Fraction(1, 3);
const b = new Fraction(1, 4);

const sum = a.add(b);
console.log(sum); // Выведет Fraction { numerator: 7, denominator: 12 }
```

Этот класс позволяет выполнять арифметические операции с дробями в удобной форме.
