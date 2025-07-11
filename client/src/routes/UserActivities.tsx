import {useEffect, useState} from "react";
import {Activity, getActivities} from "../net/activities.ts";

export function UserActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then((activities) => setActivities(activities));
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {activities.map((activity) => {
          return (
            <>
              <div className="flex flex-row">
                {activity._name}
                {activity._description}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}