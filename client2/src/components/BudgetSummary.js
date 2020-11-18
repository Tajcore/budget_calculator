import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";
import { Card, Spin } from "antd";

const BudgetSummary = () => {
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

  const { id } = useParams();
  const { data, loading } = useFetch(
    "http://localhost:5000/api/budget?id=" + id
  );
  const [summary, setSummary] = useState("")
  const [incomePie, setIncomePie] = useState({});
  const [expensePie, setExpensePie] = useState({});
  const [totalPie, setTotalPie] = useState({});
  const [date, setDate] = useState();
  useEffect(() => {
    let mounted = true;
    const handlePieDataParseIncome = (incomes) => {
      if (mounted && typeof incomes !== "undefined") {
        const colors = incomes.map(
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        );
        const data = {
          labels: incomes.map((income) => income.description),
          datasets: [
            {
              data: incomes.map((income) => income.value),
              backgroundColor: colors,
              hoverBackgroundColor: colors,
            },
          ],
        };
        setIncomePie((prevIncome) => data);
      }
    };
    const handlePieDataParseExpense = (expenses) => {
      if (mounted && typeof expenses !== "undefined") {
        const colors = expenses.map(
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        );
        const data = {
          labels: expenses.map((expense) => expense.description),
          datasets: [
            {
              data: expenses.map((expense) => expense.value),
              backgroundColor: colors,
              hoverBackgroundColor: colors,
            },
          ],
        };
        setExpensePie((prevIncome) => data);
      }
    };
    handlePieDataParseIncome(data["incomes"]);
    handlePieDataParseExpense(data["expenses"]);
    if (mounted && typeof data["incomes"] !== "undefined") {
      var sumIncome = data["incomes"].reduce(
        (total, income) => income.value + total,
        0
      );
      var sumExpense = data["expenses"].reduce(
        (total, expense) => expense.value + total,
        0
      );
      setSummary( prevSummary => sumExpense === sumIncome ? "Very Tight Budget" : sumExpense > sumIncome ? "Need to Cut Back On Spending" : "Very Solid Budget")
      var totalPieData = {
        labels: ["Expense", "Income"],
        datasets: [
          {
            data: [sumExpense, sumIncome],
            backgroundColor: ["#FF0000", "#008000"],
            hoverBackgroundColor: ["#FF0000", "#008000"],
          },
        ],
      };
      setTotalPie((prevPie) => totalPieData);
    }
    if (mounted && typeof data["date_submitted"] !== "undefined") {
      var date_submitted = new Date(data["date_submitted"]);
      setDate((prevDate) => (
        <span>
          {typeof date_submitted !== "undefined"
            ? months[date_submitted.getMonth()]
            : null}{" "}
          {date_submitted.getFullYear()}
        </span>
      ));
    }
    return () => {
      mounted = false;
    };
  }, [data, loading]);

  const piedata = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  const budgetSummary = (
    <Card
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.0)",
        border: 0,
      }}
      title={
        <div>
          <span
            style={{
              fontWeight: 600,
              textAlign: "center",
              fontSize: "1.4vw",
              color: "#f7f7f7",
            }}
          >
            {" "}
            Budget Summary of {date}
          </span>
        </div>
      }
    >
      <Card.Grid style={{ width: "50%" }}>
        <Pie
          data={expensePie}
          options={{
            onAnimationComplete: function () {
              this.showTooltip(this.segments, true);
            },
            tooltips: {
              enabled: true,
            },
            title: {
              display: true,
              text: "Expenses for the month",
              fontSize: 13,
              fontColor: "white",
            },
            legend: {
              display: true,
              labels: { fontColor: "white" },
            },
          }}
        ></Pie>
      </Card.Grid>
      <Card.Grid style={{ width: "50%" }}>
        <Pie
          data={incomePie}
          options={{
            onAnimationComplete: function () {
              this.showTooltip(this.segments, true);
            },
            tooltips: {
              enabled: true,
            },
            title: {
              display: true,
              text: "Expenses for the month",
              fontSize: 13,
              fontColor: "white",
            },
            legend: {
              display: true,
              labels: { fontColor: "white" },
            },
          }}
        ></Pie>
      </Card.Grid>
      <Card.Grid style={{ width: "100%" }}>
        <Pie
          data={totalPie}
          options={{
            onAnimationComplete: function () {
              this.showTooltip(this.segments, true);
            },
            tooltips: {
              enabled: true,
            },
            title: {
              display: true,
              text: summary,
              fontSize: 13,
              fontColor: "white",
              position: 'bottom'
            },
            legend: {
              display: true,
              labels: { fontColor: "white" },
            },
          }}
        ></Pie>
      </Card.Grid>
    </Card>
  );
  return (
    <div className="budget__summary--body">
      {loading ? <Spin /> : budgetSummary}
    </div>
  );
};

export default BudgetSummary;
