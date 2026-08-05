import AdminLayout from "../../../layouts/AdminLayout";
import { useEffect, useState } from "react";

import PackageInformation from "../../../components/Packages/PackageInformation";
import ItinerarySection from "../../../components/Packages/ItinerarySection";
import ImageUpload from "../../../components/Packages/ImageUpload";
import PackageSummary from "../../../components/Packages/PackageSummary";
import { addItinerary } from "../../../services/packageService";
import "./AddPackage.css";

import {
    createPackage,
    getAllBusesForPackages
} from "../../../services/packageService";

const AddPackage = () => {

    const [buses, setBuses] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [images, setImages] = useState([]);
    const [packageData, setPackageData] = useState({
        title: "",
        description: "",
        basePrice: "",
        durationDays: 0,
        durationNights: 0,
        destinationCity: "",
        departureDatetime: "",
        returnDatetime: "",
        totalCapacity: 0,
        busId: ""
    });

    useEffect(() => {
        loadBuses();
    }, []);

    const loadBuses = async () => {

        try {

            const response = await getAllBusesForPackages();
            setBuses(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

    const { name, value } = e.target;

    let updatedValue = value;

    if (
        name === "basePrice" ||
        name === "totalCapacity" ||
        name === "busId"
    ) {
        updatedValue = value === "" ? "" : Number(value);
    }

    setPackageData(prev => {

        const updated = {
            ...prev,
            [name]: updatedValue
        };

        // ============================
        // Validate Capacity
        // ============================

        if (
            name === "totalCapacity" ||
            name === "busId"
        ) {

            const selectedBus = buses.find(
                bus => bus.id === Number(updated.busId)
            );

            if (
                selectedBus &&
                Number(updated.totalCapacity) > selectedBus.totalSeats
            ) {

                alert(
                    `Maximum capacity allowed is ${selectedBus.totalSeats} seats`
                );

                updated.totalCapacity =
                    selectedBus.totalSeats;

            }

        }

        // ============================
        // Calculate Duration
        // ============================

        if (
            updated.departureDatetime &&
            updated.returnDatetime
        ) {

            const departure =
                new Date(updated.departureDatetime);

            const ret =
                new Date(updated.returnDatetime);

            if (ret > departure) {

                const diff =
                    ret.getTime() - departure.getTime();

                const days = Math.ceil(
                    diff / (1000 * 60 * 60 * 24)
                );

                updated.durationDays = days;
                updated.durationNights =
                    Math.max(days - 1, 0);

                // ============================
                // Auto Generate Itinerary Days
                // ============================

                const generatedDays = [];

                for (let i = 1; i <= days; i++) {

                    generatedDays.push({

                        dayNumber: i,

                        dayTitle: "",

                        hotelName: "",

                        mealsIncluded: "",

                        activities: [

                            {

                                timeOfDay: "",

                                description: ""

                            }

                        ]

                    });

                }

                setItineraries(generatedDays);

            }

        }

        return updated;

    });

};

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        console.log("Package Data:", packageData);
        console.log("Images:", images);
        console.log("Itineraries:", itineraries);

        const formData = new FormData();

        formData.append(
            "package",
            new Blob(
                [JSON.stringify(packageData)],
                {
                    type: "application/json"
                }
            )
        );

        if (images.length > 0) {
            formData.append("image", images[0]);
        }

        const response = await createPackage(formData);

        const packageId = response.data.packageId;

        for (const itinerary of itineraries) {

            await addItinerary(
                packageId,
                itinerary
            );

        }

        alert("Package Created Successfully");

    } catch (error) {

        console.error(error);

        alert("Failed To Create Package");

    }

};

    return (

        <AdminLayout>

            <div className="container-fluid add-package-page">

                {/* Page Header */}

                <div className="page-header">

                    <h2 className="page-title">
                        Add New Holiday Package
                    </h2>

                    <p className="page-subtitle">
                        Create and manage holiday packages
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* ==========================
                        Row 1
                    ========================== */}

                    <div className="row g-4">

                        {/* Package Information */}

                        <div className="col-lg-8">

                            <PackageInformation
                                packageData={packageData}
                                handleChange={handleChange}
                                buses={buses}
                            />

                        </div>

                        {/* Right Sidebar */}

                        <div className="col-lg-4">

                            <ImageUpload
                                images={images}
                                setImages={setImages}
                            />

                            <div className="mt-4">

                                <PackageSummary
                                    packageData={packageData}
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==========================
                        Row 2
                    ========================== */}

                    <div className="row mt-4">

                        <div className="col-12">

                            <ItinerarySection
                                itineraries={itineraries}
                                setItineraries={setItineraries}
                            />

                        </div>

                    </div>

                </form>

            </div>

        </AdminLayout>

    );

};

export default AddPackage;