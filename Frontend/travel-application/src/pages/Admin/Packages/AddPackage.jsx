import { useEffect, useState } from "react";
import PackageInformation from "../../../components/Packages/PackageInformation";
import ItinerarySection from "../../../components/Packages/ItinerarySection";
import ImageUpload from "../../../components/Packages/ImageUpload";
import PackageSummary from "../../../components/Packages/PackageSummary";
import "./AddPackage.css";

import {
    createPackage,
    getAllBuses,
    addItinerary
} from "../../../services/packageService";

const AddPackage = () => {

    const [buses, setBuses] = useState([]);
    const [itineraries, setItineraries] = useState([]);

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

            const response = await getAllBuses();
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
                        diff /
                        (1000 * 60 * 60 * 24)
                    );

                    updated.durationDays = days;
                    updated.durationNights =
                        Math.max(days - 1, 0);

                }

            }

            return updated;

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            console.log(packageData);
            console.log(itineraries);

            const response =
                await createPackage(packageData);

            const packageId =
                response.data.packageId;

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

        <div className="container-fluid add-package-page">

            <div className="page-header">

                <h2 className="page-title">

                    Add New Holiday Package

                </h2>

                <p className="page-subtitle">

                    Create and manage holiday packages

                </p>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="row g-4 align-items-start">

                    <div className="col-xl-5 col-lg-6">

                        <PackageInformation
                            packageData={packageData}
                            handleChange={handleChange}
                            buses={buses}
                        />

                    </div>

                    <div className="col-xl-4 col-lg-6">

                        <ItinerarySection
                            itineraries={itineraries}
                            setItineraries={setItineraries}
                        />

                    </div>

                    <div className="col-xl-3 col-lg-12">

                        <ImageUpload />

                        <PackageSummary
                            packageData={packageData}
                        />

                    </div>

                </div>

            </form>

        </div>

    );

};

export default AddPackage;