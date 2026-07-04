/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ComposeAppSimulator } from "./components/ComposeAppSimulator";

export default function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#110b0a]" id="app-root-frame">
      <ComposeAppSimulator />
    </div>
  );
}
