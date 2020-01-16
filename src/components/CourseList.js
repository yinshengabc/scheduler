import React,{ useState, } from 'react';//makes React available to the JavaScript
import 'rbx/index.css';
import { Button } from "rbx";
import { terms , buttonColor , getCourseTerm, Course } from './Course/Course';
import { timeConflict } from './Course/times';

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ? selected.filter(y => y !== x) :[x].contat(selected))
  };
  return [selected, toggle];
};

const CourseList = ({ courses, user }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term === getCourseTerm(course));
  
  return (
    <React.Fragment>
      <TermSelector state={ { term, setTerm } } />
      <Button.Group>
        { termCourses.map(course =>
           <Course key={ course.id } course={ course }
             state={ { selected, toggle } }
             user={ user } />) }
      </Button.Group>
    </React.Fragment>
  );
};

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

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

export default CourseList;
export {courseConflict};