import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LinkusDialer from "../../../core/common/linkus/LinkusDialer";
import { setLinkusDialerActive } from "../../../core/data/redux/slices/ProfileSlice";

const LinkusClient = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile);

  // Set dialer active state on mount, clear on unmount
  useEffect(() => {
    dispatch(setLinkusDialerActive(true));

    return () => {
      dispatch(setLinkusDialerActive(false));
    };
  }, [dispatch]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-sm-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="page-header mb-0">
                          <div className="row align-items-center">
                            <h4 className="page-title mb-0">Phone System</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h1 className="text-2xl font-bold text-gray-800">
                                Linkus Phone System
                              </h1>
                              <p className="text-gray-600 text-sm mt-1">
                                Extension:{" "}
                                {userProfile?.extensionNumber ||
                                  "Not configured"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">
                          Softphone
                        </h2>
                        <LinkusDialer mode="full" />
                      </div>

                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          Phone System Information
                        </h3>
                        <div className="text-gray-700 text-sm space-y-2">
                          <p>
                            • Your extension is{" "}
                            <strong>{userProfile?.extensionNumber}</strong>
                          </p>
                          <p>
                            • When{" "}
                            <strong className="text-green-600">Ready</strong>,
                            you can receive incoming calls
                          </p>
                          <p>• Use the dialpad to make outgoing calls</p>
                          <p>
                            • The phone will automatically show incoming call
                            notifications
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkusClient;
