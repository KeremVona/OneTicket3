import ActiveTasks from "../../components/Technician/ActiveTasks";
import AvailablePool from "../../components/Technician/AvailablePool";
import PastSolutions from "../../components/Technician/PastSolutions";
import TechnicianOverview from "../../components/Technician/TechnicianOverview";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

const TechnicianHome = () => {
  //const dispatch = useAppDispatch()
  //const {} = useAppSelector((state) => state)
  return (
    <>
      <TechnicianOverview
        activeAssignments={5}
        newInField={2}
        technicianField="software"
        weeklyResolutions={4}
        technicianName="test1"
      />
      <AvailablePool
        technicianField="software"
        onClaimTicket={() => console.log("click")}
        tickets={[]}
      />
      <ActiveTasks
        technicianField="software"
        tickets={[]}
        onMarkAsFixed={() => console.log("click")}
      />
      <PastSolutions
        technicianField="hardware"
        technicianId={"fbhahshbf"}
        tickets={[]}
      />
    </>
  );
};

export default TechnicianHome;
