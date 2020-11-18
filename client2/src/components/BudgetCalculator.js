import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useStore } from "../store/reducers/userStore";
import { Button, Tooltip, Spin, Alert } from "antd";
import { CloudUploadOutlined, HistoryOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import iosCheckmarkOutline from "@iconify-icons/ion/ios-checkmark-outline";
import iosCloseCircleOutline from "@iconify-icons/ion/ios-close-circle-outline";

const monetaryTemplate = (value, description) => {
  return { value: value, description: description };
};
const BudgetCalculator = () => {
  const history = useHistory();
  const date = new Date(Date.now());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const updateIncomes = (income) => {
    setIncomes((prevIncomes) => [...prevIncomes, income]);
  };

  const updateExpenses = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };
  const removeIncome = (budget, index) => {
    setIncomes((prevIncomes) =>
      prevIncomes.filter((budget_, index_) => {
        return budget_ !== budget && index !== index_;
      })
    );
  };

  const removeExpense = (budget, index) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((budget_, index_) => {
        return budget_ !== budget && index !== index_;
      })
    );
  };

  const getTotalExpense = useCallback(() => {
    if (expenses.length === 0) {
      return 0;
    }
    var sum = 0;
    for (const expense of expenses) {
      sum = sum + expense.value;
    }
    return sum;
  }, [expenses]);

  const getTotalIncome = useCallback(() => {
    if (incomes.length === 0) {
      return 0;
    }
    var sum = 0;
    for (const income of incomes) {
      sum = sum + income.value;
    }
    return sum;
  }, [incomes]);

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  const renderExpenses = expenses.map((expense, index) => {
    return (
      <div className="item clearfix " key={"exp" + index}>
        <div className="item__description">{expense.description}</div>
        <div className="right clearfix">
          <div className="item__value">- {expense.value}</div>
          <div className="item__percentage">
            {Math.round((expense.value / totalExpense) * 100)}%
          </div>

          <button
            onClick={() => {
              removeExpense(expense, index);
            }}
            className="item__delete--btn"
          >
            <Icon icon={iosCloseCircleOutline} color="red" />
          </button>
        </div>
      </div>
    );
  });

  const renderIncomes = incomes.map((income, index) => {
    return (
      <div className="item clearfix" key={"inc" + index}>
        <div className="item_description">{income.description}</div>
        <div className="right clearfix">
          <div className="item__value">+ {income.value}</div>
          <button
            onClick={() => {
              removeIncome(income, index);
            }}
            className="item__delete--btn"
          >
            <Icon icon={iosCloseCircleOutline} color="red" />
          </button>
        </div>
      </div>
    );
  });

  const [currentDescription, setCurrentDescription] = useState("");
  const [currentValue, setCurrentValue] = useState(0);
  const [currentType, setCurrentType] = useState("inc");

  const handleAddition = (type, value, description) => {
    if (value >= 0 || description.length !== 0 || type.length !== 0)
      switch (type) {
        case "exp":
          const expense = monetaryTemplate(value, description);
          updateExpenses(expense);
          return null;
        case "inc":
          const income = monetaryTemplate(value, description);
          updateIncomes(income);
          return null;
        default:
          return null;
      }
  };

  const { state } = useStore();
  const [isLoading, setLoading] = useState(false);
  const [errorBody, setError] = useState();

  const handleSubmission = () => {
    const total = totalIncome + totalExpense;
    setLoading(true);
    axios
      .post("/api/budget", {
        id: state.id,
        total_profit: total,
        incomes: incomes,
        expenses: expenses,
      })
      .then((res) => {
        setLoading(false);
        setError();
        history.push("/budget/summary/"+res.data._id)
      })
      .catch((err) => {
        setLoading(false);
        setError((prevError) => (
          <Alert
            message={<span><b>Error (Status {err.response.status})</b></span>}
            description={err.response.data.error}
            type="warning"
          />
        ));
      });
  };

  useEffect(() => {}, [expenses, incomes, currentValue, currentDescription]);

  const makeAddition = () => {
    handleAddition(currentType, currentValue, currentDescription);
    setCurrentDescription((prevDescription) => "");
    setCurrentValue((prevValue) => 0);
  };

  return (
    <div>
      <div className="top">
        <div className="budget">
          <div className="budget__title">
            Available Budget
            <span className="budget__title--month">
              {" "}
              {months[date.getMonth()]} {date.getFullYear()}
            </span>
            :
          </div>

          <div className="budget__value">
            {totalIncome - totalExpense < 0 ? "-" : "+"} ${" "}
            {Math.abs(totalIncome - totalExpense)}
          </div>
          <Spin spinning={isLoading}>
            <div className="budget__income clearfix">
              <div className="budget__income--text">Income</div>
              <div className="right">
                <div className="budget__income--value">+ {totalIncome}</div>
                <div className="budget__income--percentage">&nbsp;</div>
              </div>
            </div>

            <div className="budget__expenses clearfix">
              <div className="budget__expenses--text">Expenses</div>
              <div className="right clearfix">
                <div className="budget__expenses--value">- {totalExpense}</div>
                <div className="budget__expenses--percentage">
                  {totalExpense === 0 && totalIncome === 0
                    ? 0
                    : (
                        (totalExpense / (totalExpense + totalIncome)) *
                        100
                      ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>

      <div className="bottom">
        <div className="add">
          <div className="add__container">
            <select
              value={currentType}
              onChange={(e) => setCurrentType((prevType) => e.target.value)}
              className="add__type"
            >
              <option value="inc">+</option>
              <option value="exp">-</option>
            </select>
            <input
              onChange={(e) =>
                setCurrentDescription((prevDescription) => e.target.value)
              }
              type="text"
              value={currentDescription}
              className="add__description"
              placeholder="Add description"
            ></input>
            <input
              onChange={(e) =>
                setCurrentValue((prevValue) =>
                  prevValue !== null ? parseInt(e.target.value) : 0
                )
              }
              type="number"
              pattern="^[1-9]\d*$"
              value={currentValue}
              min="0"
              className="add__value"
              placeholder="Value"
            ></input>
            <button className="add__btn">
              <Icon
                onClick={makeAddition}
                icon={iosCheckmarkOutline}
                color="green"
              />
            </button>
          </div>
        </div>

        <div className="container clearfix">
          <div className="income">
            <h2 className="income__title">Income</h2>

            <div className="income__list">
              {incomes.length > 0 ? renderIncomes : null}
            </div>
          </div>

          <div className="expenses">
            <h2 className="expenses__title">Expenses</h2>

            <div className="expenses__list">
              {expenses.length > 0 ? renderExpenses : null}
            </div>
          </div>
          <div className="btn_group">
            <Tooltip title="Submit Budget Sheet (nb. Only 1 submission per month)">
              <Button
                onClick={handleSubmission}
                shape="round"
                icon={<CloudUploadOutlined />}
              >
                Submit
              </Button>
            </Tooltip>
            <Tooltip title="View Budget History">
              <Button shape="round" icon={<HistoryOutlined />}>
                Past Budgets
              </Button>
            </Tooltip>
          </div>
          {errorBody}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
