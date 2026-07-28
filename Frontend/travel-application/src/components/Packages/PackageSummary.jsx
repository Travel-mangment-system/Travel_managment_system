const PackageSummary = ({ packageData }) => {

    return (

        <div className="card package-card summary-card">

            <div className="card-header">

                <h4 className="mb-0 fw-bold">
                    Package Summary
                </h4>

                <small className="text-muted">
                    Review package details before saving.
                </small>

            </div>

            <div className="card-body">

                <div className="summary-item">
                    <span>Package</span>
                    <strong>
                        {packageData.title || "-"}
                    </strong>
                </div>

                <hr />

                <div className="summary-item">
                    <span>Destination</span>
                    <strong>
                        {packageData.destinationCity || "-"}
                    </strong>
                </div>

                <hr />

                <div className="summary-item">
                    <span>Price</span>
                    <strong>
                        ₹ {packageData.basePrice || 0}
                    </strong>
                </div>

                <hr />

                <div className="summary-item">
                    <span>Duration</span>
                    <strong>
                        {packageData.durationDays || 0} Days /
                        {" "}
                        {packageData.durationNights || 0} Nights
                    </strong>
                </div>

                <hr />

                <div className="summary-item">
                    <span>Capacity</span>
                    <strong>
                        {packageData.totalCapacity || 0}
                    </strong>
                </div>

                <hr />

                <div className="summary-item">
                    <span>Assigned Bus</span>
                    <strong>
                        {packageData.busId || "-"}
                    </strong>
                </div>

                <div className="d-grid gap-3 mt-4">

                    <button
                        type="submit"
                        className="btn btn-primary save-btn"
                    >
                        Save Package
                    </button>

                    <button
                        type="reset"
                        className="btn btn-outline-secondary"
                    >
                        Reset Form
                    </button>

                </div>

            </div>

        </div>

    );

};

export default PackageSummary;