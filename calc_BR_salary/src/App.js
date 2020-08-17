import React from 'react';
import Bar from './bar';
import { calculateSalaryFrom } from './helpers/salary';
import ReadOnlyInput from './helpers/ReadOnlyInput';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      number: 1,
      bar1: 50,
      bar2: 50,
      bar3: 50,

      salarioCal: {
        baseINSS: 0,
        discountINSS: 0,
        baseIRPF: 0,
        discountIRPF: 0,
        netSalary: 0,
      },
    };
  }
  componentDidUpdate(_, previousState) {
    const { number: oldNumber } = previousState;
    const { number: newNumber } = this.state;

    if (oldNumber !== newNumber) {
      const salarioCal = calculateSalaryFrom(this.state.number);
      this.setState({ salarioCal });
      this.handleChangeBar(salarioCal);
    }
  }

  handleInputChange = (event) => {
    const newNumber = Number(event.target.value);
    this.setState({ number: newNumber });

    // this.setState({ number: newNumber }, () => {
    //   const calculations = getCalculationsFrom(this.state.number);
    //   this.setState({ calculations });
    // });
  };

  calculoPercentage(percBaseInss, percToCalculo) {
    let percInss = (100 * percToCalculo) / percBaseInss;
    return percInss.toFixed(2);
  }

  handleChangeBar = (salarioCal) => {
    console.log(salarioCal);
    const bar1 = this.calculoPercentage(
      salarioCal.baseINSS,
      salarioCal.discountINSS
    );
    const bar2 = this.calculoPercentage(
      salarioCal.baseINSS,
      salarioCal.discountIRPF
    );
    const bar3 = this.calculoPercentage(
      salarioCal.baseINSS,
      salarioCal.netSalary
    );

    this.setState({ bar1, bar2, bar3 });
  };

  render() {
    const { bar1, bar2, bar3, number, salarioCal } = this.state;

    const {
      baseINSS,
      discountINSS,
      baseIRPF,
      discountIRPF,
      netSalary,
    } = salarioCal;

    return (
      <div>
        <h1>Calculo com o teto do INSS</h1>
        <div className="App">
          <h1>React Salário</h1>
          <label>
            <span>Salario Bruto: </span>
            <input
              type="number"
              value={number}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <br />
          <ReadOnlyInput description="Base INSS: " value={baseINSS} />
          <ReadOnlyInput
            description="Desconto INSS: "
            value={
              discountINSS +
              `(${this.calculoPercentage(baseINSS, discountINSS, bar1)}%)`
            }
          />
          <ReadOnlyInput description="Base IRPF: " value={baseIRPF} />
          <ReadOnlyInput
            description="Desconto IRPF: "
            value={
              discountIRPF +
              `(${this.calculoPercentage(baseINSS, discountIRPF, bar2)}%)`
            }
          />
          <ReadOnlyInput
            description="Salário Liquido: "
            value={
              netSalary +
              `(${this.calculoPercentage(baseINSS, netSalary, bar3)}%)`
            }
          />

          <br />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bar value={bar1} color="red" />
          <Bar value={bar2} color="green" />
          <Bar value={bar3} color="blue" />
        </div>
      </div>
    );
  }
}
