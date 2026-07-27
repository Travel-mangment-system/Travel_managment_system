const PackageInformation = ({
    packageData,
    handleChange,
    buses
}) => {

    return (

        <div className="card package-card h-100">

            <div className="card-header">

                <h4 className="mb-0 fw-bold">
                    Package Information
                </h4>

                <small className="text-muted">
                    Enter the basic details of the holiday package.
                </small>

            </div>

            <div className="card-body">

                <div className="row g-4">

                    {/* Package Title */}

                    <div className="col-md-12">

                        <label className="form-label">
                            Package Title
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={packageData.title}
                            onChange={handleChange}
                            placeholder="Enter package title"
                            required
                        />

                    </div>

                    {/* Destination */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Destination
                        </label>

                        <select
                            className="form-select"
                            name="destinationCity"
                            value={packageData.destinationCity}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Destination
                            </option>

                            <option value="Goa">
                                Goa
                            </option>

                            <option value="Manali">
                                Manali
                            </option>

                            <option value="Kerala">
                                Kerala
                            </option>

                            <option value="Kashmir">
                                Kashmir
                            </option>

                        </select>

                    </div>

                    {/* Base Price */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Base Price (₹)
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="basePrice"
                            value={packageData.basePrice}
                            onChange={handleChange}
                            placeholder="25000"
                            required
                        />

                    </div>

                    {/* Description */}

                    <div className="col-12">

                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            rows="5"
                            className="form-control"
                            name="description"
                            value={packageData.description}
                            onChange={handleChange}
                            placeholder="Write package description..."
                        />

                    </div>

                    {/* Departure */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Departure Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="departureDatetime"
                            value={packageData.departureDatetime}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Return */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Return Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            className="form-control"
                            name="returnDatetime"
                            value={packageData.returnDatetime}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Duration Days */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Duration (Days)
                        </label>

                        <input
                            type="number"
                            className="form-control bg-light"
                            value={packageData.durationDays}
                            readOnly
                        />

                    </div>

                    {/* Duration Nights */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Duration (Nights)
                        </label>

                        <input
                            type="number"
                            className="form-control bg-light"
                            value={packageData.durationNights}
                            readOnly
                        />

                    </div>

                    {/* Capacity */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Total Capacity
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="totalCapacity"
                            value={packageData.totalCapacity}
                            onChange={handleChange}
                            placeholder="40"
                            required
                        />

                    </div>

                    {/* Bus */}

                    <div className="col-md-6">

                        <label className="form-label">
                            Assign Bus
                        </label>

                        <select
                            className="form-select"
                            name="busId"
                            value={packageData.busId}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Bus
                            </option>

                            {
                                buses.length > 0
                                    ? buses.map(bus => (

                                        <option
                                            key={bus.id}
                                            value={bus.id}
                                        >

                                            {bus.busName} ({bus.busNumber})

                                        </option>

                                    ))
                                    :

                                    <option disabled>

                                        No Buses Available

                                    </option>
                            }

                        </select>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default PackageInformation;