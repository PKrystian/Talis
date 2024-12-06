import React from 'react';
import './LicensePage.css';
import MetaComponent from '../../meta/MetaComponent';

const LicensePage = () => {
  return (
    <div className="license-container">
      <MetaComponent
        title="Talis License"
        description="View the license under which our website operates"
        canonical="license"
      />
      <h1 className="license-header">MIT License</h1>
      <p className="license-paragraph">Copyright (c) 2024 Krystian Pińczak</p>
      <p className="license-paragraph">
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the
        &quot;Software&quot;), to deal in the Software without restriction,
        including without limitation the rights to use, copy, modify, merge,
        publish, distribute, sublicense, and/or sell copies of the Software, and
        to permit persons to whom the Software is furnished to do so, subject to
        the following conditions:
      </p>
      <p className="license-paragraph">
        The above copyright notice and this permission notice shall be included
        in all copies or substantial portions of the Software.
      </p>
      <p className="license-paragraph">
        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  );
};

export default LicensePage;
