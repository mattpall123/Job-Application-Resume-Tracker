import { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

const CompanyFilter = ({ allJobs, setJobs, fetchJobs }) => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    if (!allJobs || allJobs.length === 0) {
      setCompanyOptions([]);
      return;
    }

    const uniqueCompanies = [...new Set(
      allJobs
        .map((job) => job.companyName)
        .filter((company) => company && company.trim() !== "")
    )].sort();

    setCompanyOptions(uniqueCompanies);
      }, [allJobs]);

      const handleFilterChange = async (e) => {
        const companyName = e.target.value;
        setSelectedCompany(companyName);

        if (companyName === "") {
          fetchJobs();
          return;
        }

        try {
              const res = await axios.get("/api/jobs/company", {
                params: { name: companyName }
              });
              setJobs(res.data);
            } catch (err) {
              console.error("Failed to filter jobs by company:", err);
            }
          };

          if (!allJobs || allJobs.length === 0) {
            return null;
          }

     return (
         <div className="companyFilterContainer">
           <label htmlFor="companyFilter" className="companyFilterLabel">
            <FaFilter style ={{color: "var(--purple)"}}/> Filter by Company
           </label>

           <select
             id="companyFilter"
             className="companyFilterSelect"
             value={selectedCompany}
             onChange={handleFilterChange}
           >
             <option value="">All Companies</option>
             {companyOptions.map((company) => (
               <option key={company} value={company}>
                 {company}
                  </option>
                         ))}
                       </select>
                     </div>
                   );
                 };

                 export default CompanyFilter;



