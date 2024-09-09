import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";

type PreferenceNavProps = {};

const PreferenceNav: React.FC<PreferenceNavProps> = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }

    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const exithandler = (e: any) => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        // console.log(isFullScreen);

        return;
      }
      setIsFullScreen(true);
    };

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exithandler);
      document.addEventListener("webkitfullscreenchange", exithandler);
      document.addEventListener("mozfullscreenchange", exithandler);
      document.addEventListener("msfullscreenchange", exithandler);
    }
  }, [isFullScreen]);

  return (
    <div className="flex justify-between items-center h-11 w-full bg-dark-layer-2">
      <div className="text-white">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2 dark:text-dark-label-2">
              JavaScript
            </div>
          </div>
        </button>
      </div>
      <div className="flex items-center m-2">
        <button
          className="preferenceBtn group"
          // onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip">Settings</div>
        </button>

        <button
          className="preferenceBtn group"
          // onClick={handleFullScreen}
        >
          <div
            className="h-4 w-4 text-dark-gray-6 font-bold text-lg"
            onClick={handleFullScreen}
          >
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="preferenceBtn-tooltip">Full Screen</div>
        </button>
      </div>
      {/* {settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />} */}
    </div>
  );
};
export default PreferenceNav;
