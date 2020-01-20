/*
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package elemental2.dom;

import elemental2.core.JsArray;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(isNative = true, namespace = JsPackage.GLOBAL)
public class TrustedTypePolicyFactory {
  public TrustedHTML emptyHTML;

  public native TrustedTypePolicy createPolicy(
      String name, TrustedTypePolicyOptions policy, boolean expose);

  public native TrustedTypePolicy createPolicy(String name, TrustedTypePolicyOptions policy);

  @Deprecated
  public native TrustedTypePolicy getExposedPolicy(String name);

  public native JsArray<String> getPolicyNames();

  public native boolean isHTML(Object obj);

  public native boolean isScript(Object obj);

  public native boolean isScriptURL(Object obj);

  @Deprecated
  public native boolean isURL(Object obj);
}
