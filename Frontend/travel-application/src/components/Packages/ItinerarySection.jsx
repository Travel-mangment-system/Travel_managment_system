import { useEffect } from "react";

const ItinerarySection = ({ itineraries, setItineraries }) => {

    useEffect(() => {

        if (itineraries.length === 0) {

            setItineraries([
                {
                    dayNumber: 1,
                    dayTitle: "",
                    hotelName: "",
                    mealsIncluded: "",
                    activities: [
                        {
                            timeOfDay: "",
                            description: ""
                        }
                    ]
                }
            ]);

        }

    }, []);

    const addDay = () => {

        setItineraries([
            ...itineraries,
            {
                dayNumber: itineraries.length + 1,
                dayTitle: "",
                hotelName: "",
                mealsIncluded: "",
                activities: [
                    {
                        timeOfDay: "",
                        description: ""
                    }
                ]
            }
        ]);

    };

    const removeDay = (index) => {

        const temp = [...itineraries];

        temp.splice(index, 1);

        temp.forEach((day, i) => {
            day.dayNumber = i + 1;
        });

        setItineraries(temp);

    };

    const addActivity = (dayIndex) => {

        const temp = [...itineraries];

        temp[dayIndex].activities.push({
            timeOfDay: "",
            description: ""
        });

        setItineraries(temp);

    };

    const removeActivity = (dayIndex, activityIndex) => {

        const temp = [...itineraries];

        temp[dayIndex].activities.splice(activityIndex, 1);

        if (temp[dayIndex].activities.length === 0) {

            temp[dayIndex].activities.push({
                timeOfDay: "",
                description: ""
            });

        }

        setItineraries(temp);

    };

    const handleDayChange = (e, index) => {

        const temp = [...itineraries];

        temp[index][e.target.name] = e.target.value;

        setItineraries(temp);

    };

    const handleActivityChange = (e, dayIndex, activityIndex) => {

        const temp = [...itineraries];

        temp[dayIndex].activities[activityIndex][e.target.name] =
            e.target.value;

        setItineraries(temp);

    };

    return (

        <div className="card package-card h-100">

            <div className="card-header d-flex justify-content-between align-items-center">

                <div>

                    <h4 className="mb-1 fw-bold">
                        Package Itinerary
                    </h4>

                    <small className="text-muted">
                        Plan each day's schedule and activities.
                    </small>

                </div>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={addDay}
                >
                    + Add Day
                </button>

            </div>

            <div className="card-body">

                {

                    itineraries.map((day, dayIndex) => (

                        <div
                            key={dayIndex}
                            className="day-card"
                        >

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h5 className="fw-bold text-primary mb-0">

                                    Day {day.dayNumber}

                                </h5>

                                {

                                    itineraries.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => removeDay(dayIndex)}
                                        >
                                            Remove Day
                                        </button>

                                    )

                                }

                            </div>

                            <div className="row g-3">

                                <div className="col-md-4">

                                    <label className="form-label">

                                        Day Title

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Arrival"
                                        name="dayTitle"
                                        value={day.dayTitle}
                                        onChange={(e) =>
                                            handleDayChange(e, dayIndex)
                                        }
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label">

                                        Hotel Name

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Hotel Paradise"
                                        name="hotelName"
                                        value={day.hotelName}
                                        onChange={(e) =>
                                            handleDayChange(e, dayIndex)
                                        }
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label">

                                        Meals Included

                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Breakfast, Dinner"
                                        name="mealsIncluded"
                                        value={day.mealsIncluded}
                                        onChange={(e) =>
                                            handleDayChange(e, dayIndex)
                                        }
                                    />

                                </div>

                            </div>

                            <hr className="my-4" />

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <h6 className="fw-bold mb-0">

                                    Activities

                                </h6>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => addActivity(dayIndex)}
                                >
                                    + Add Activity
                                </button>

                            </div>

                            {

                                day.activities.map((activity, activityIndex) => (

                                    <div
                                        key={activityIndex}
                                        className="activity-card mb-3"
                                    >

                                        <div className="row g-3 align-items-end">

                                            <div className="col-md-3">

                                                <label className="form-label">

                                                    Time

                                                </label>

                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    name="timeOfDay"
                                                    value={activity.timeOfDay}
                                                    onChange={(e) =>
                                                        handleActivityChange(
                                                            e,
                                                            dayIndex,
                                                            activityIndex
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-7">

                                                <label className="form-label">

                                                    Activity Description

                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Visit Beach / Sightseeing"
                                                    name="description"
                                                    value={activity.description}
                                                    onChange={(e) =>
                                                        handleActivityChange(
                                                            e,
                                                            dayIndex,
                                                            activityIndex
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-2">

                                                <button
                                                    type="button"
                                                    className="btn btn-danger w-100"
                                                    onClick={() =>
                                                        removeActivity(
                                                            dayIndex,
                                                            activityIndex
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    ))

                }

            </div>

        </div>

    );

};

export default ItinerarySection;