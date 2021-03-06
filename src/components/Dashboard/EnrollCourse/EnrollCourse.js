import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { userContext } from '../../../App';
import PaymentStripe from '../PaymentStripe/PaymentStripe';
import ChooseCourse from './ChooseCourse';
const EnrollCourse = () => {
    let { courseId } = useParams();
    // if(!courseId){
    //     courseId = "607a588f69e0a20a643407fa";
    // }
    const [currentUser, setCurrentUser] = useContext(userContext);
    const [course, setCourse] = useState({});
    const history = useHistory();
    
    useEffect(() => {
        if(courseId){
            fetch(`https://pro-tutors.herokuapp.com/course/${courseId}`)
                .then((res) => res.json())
                .then((data) => setCourse(data));
        }
    }, [courseId]);

    if(!courseId){
        return <ChooseCourse />
    }
    if (currentUser.enrolledCourses?.indexOf(courseId) > -1){
        return (
            <h2 className="text-center my-5">
                You Already Enrolled In <span className="text-brand">{course && course.name}</span>!
                <br /> Happy Learning...
            </h2>
        );
    }
        return (
            <div>
                <h5>Enroll in:</h5>
                <h3 className="text-brand">{course.name}</h3>
                <form action="">
                    <input
                        type="text"
                        placeholder="Name"
                        readOnly
                        value={currentUser.displayName}
                    />
                    <input type="text" placeholder="Email" readOnly value={currentUser.email} />
                    <input type="text" placeholder="Course" readOnly value={course.name} />
                    <input type="text" placeholder="Price" readOnly value={"$" + course.price} />
                </form>
                <h5 className="my-3">
                    Pay With <i>Credit Card</i>:
                </h5>
                <PaymentStripe handleEnroll={handleEnroll} />
            </div>
        );

    function handleEnroll(paymentId){
        const enrollInfo = {
            currentUser,
            course,
            paymentId,
            enrollTime: new Date(),
        };
        fetch(`https://pro-tutors.herokuapp.com/enrollCourse`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': localStorage.getItem('ptToken')
            },
            body: JSON.stringify(enrollInfo)
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                history.push('/dashboard/enrolled-courses')
            } else {
                alert("Couldn't enroll! Please try again!");
            }
        })
    }
};

export default EnrollCourse;