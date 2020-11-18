import React, { useState , useEffect} from "react";
import history_icon from "../assets/icons/history.svg";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import dummyBudgets from '../components/dummyBudgets'
function Sidebar() {
 

  const [budgets, setBudgets] = useState(dummyBudgets)
  const userIP = window.localStorage.getItem("ip");
  const budgetsPerPage = 5;
  const [activePage, setCurrentPage] = useState(1);

  // Logic for displaying current budgets
  const indexOfLastBudget = activePage * budgetsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - budgetsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);

  const renderBudgets = currentBudgets.map((budget, index) => {
    return (
      <Link to={"/budget/"+ budget.id} key={budget.id}>
        <div className="budget-template" >
          <div className="month">{budget.month.charAt(0)}</div>
          <div className="date">
            <div className="text">{budget.month}</div>
            <div className="value">
              <div className="text">{budget.year} -</div>
              <div className="text-bold">
                ${budget.savings + budget.income - budget.expenses}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  });

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setCurrentPage(pageNumber);
  };

  return (
    <div className="side-bar">
      <div className="side-bar-title">
        <img src={history_icon} className="icon" alt="History Icon" />
        <div className="text">Past Budgets</div>
      </div>
      <div className="budget-listings">{renderBudgets}</div>
      <div className="budget-commands">
        <Pagination
          current={activePage}
          total={budgets.length}
          pageSize={budgetsPerPage}
          onChange={handlePageChange}
        ></Pagination>
        <div>
          <Link to="/">
            <button>To Form</button>
          </Link>
        </div>
      </div>
      <div>User IP: {userIP}</div>
    </div>
  );
}

export { Sidebar };
