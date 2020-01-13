/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React,{ useState, useEffect } from 'react';//makes React available to the JavaScript
import '../../node_modules/rbx/index.css';
import{ Button, Container,Title } from 'rbx';

/*
const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": [
    {
      "id": "F101",
      "title": "Computer Science: Concepts, Philosophy, and Connections",
      "meets": "MWF 11:00-11:50"
    },
    {
      "id": "F110",
      "title": "Intro Programming for non-majors",
      "meets": "MWF 10:00-10:50"
    },
    {
      "id": "F111",
      "title": "Fundamentals of Computer Programming I",
      "meets": "MWF 13:00-13:50"
    },
    {
      "id": "F211",
      "title": "Fundamentals of Computer Programming II",
      "meets": "TuTh 12:30-13:50"
    }
  ]
};
*/

const terms = { F: 'Fall', W: 'Winter', S:'Spring'};

const Banner = ({title}) => (
  <Title>{title || '[loading...]'}</Title>
);

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1,4)
);

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
);

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: schedule.courses.map(addCourseTimes)
});

const Course = ({course, state}) => (
  <Button color = {buttonColor(state.selected.includes(course))}
    onClick = { () => state.toggle(course)}
    disabled = { hasConflict(course,state.selected)}
    >
    { getCourseTerm(course)} CS { getCourseNumber(course)}: {course.title}
  </Button>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term === getCourseTerm(course));

  return(
    //to group several components into one without generating an unnecessary HTML element, such as div
    <React.Fragment> 
      <TermSelector state = {{ term, setTerm }} />
      <Button.Group>
      { termCourses.map(course => <Course key={ course.id } course={ course } state ={{selected, toggle}}/>)} 
      </Button.Group>
    </React.Fragment>
    );
  };

const buttonColor = selected =>(
  selected ? 'success': null
);

const TermSelector =({ state }) => (
  <Button.Group hasAddons>
    {
      Object.values(terms)
      .map(value => 
      <Button key={ value }
        color = { buttonColor(value === state.term)}
        onClick = { () => state.setTerm(value)}
        >{ value }
      </Button>)
    }
  </Button.Group>
);

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ? selected.filter(y => y !== x) :[x].contat(selected))
  };
  return [selected, toggle];
};

const App = () =>  {
  const [schedule, setSchedule] = useState({title:'', courses:[]});
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(addScheduleTimes(json));
    }
    fetchSchedule();
  },[])
  return(
    <Container>
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </Container>
  );
};

export default App;//makes the function App available to any script that imports this file