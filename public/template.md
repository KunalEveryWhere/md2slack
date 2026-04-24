# 🎉 Robotiive v2.xx.0
[Robotiive v2.xx.0]() has been released! You can find the [download file here]().

## :warning: Notice
* `Date-Time Offset` calculation now uses **calendar-based adjustments**.
* `Dialog Box Timeout` configuration will now also apply to the `Action Input box`. If the action timeout value is longer than the Global Configuration Dialog Timeout setting, the Global Configuration Dialog Timeout will take precedence.


## :rocket: What’s New?
* `Log Retention` and `Deletion` features have been introduced in Robotiive:  
  * Users can now configure how long logs are retained.  
  * Logs older than the specified retention period are automatically deleted.  
  * Users can also manually bulk delete:  
    * All logs  
    * All Task logs  
    * All Pipeline logs  
  * **Note**: This is currently a Robotiive Desktop exclusive feature.  
* Images are now supported in `Logs` on Robotiive Server.


## :wrench: Enhancements
* Robotiive will now **prevent application crashes** caused by internal errors during action execution.   
* Removed the `Scale` parameter for `PaddleOCR v5 (β Beta)`, as it is no longer required and may reduce OCR coverage.   
* Refined error messages and handling for `Variable Name` of `Set Variable Action` to improve clarity. 


## :beetle: Bug Fixes
* Fixed: `Action Comments` are not visible on mouse hover.  
* Fixed: Incorrect `Date-Time Offset` calculations in certain edge cases.  
* Fixed: Race condition when multiple pipelines are executed at the same time via API triggers.  
* Fixed: Added tooltips for `Write Text to Excel Range` properties.   
* Fixed: `Click location in logs` was not displayed when the click occurred on a secondary screen in dual-screen setups.


## :art: UI Changes
* `Toasts` have been updated with improved styling for a cleaner, more polished appearance.
* `Configuration Page` has been updated with new tabs and reorganized settings.