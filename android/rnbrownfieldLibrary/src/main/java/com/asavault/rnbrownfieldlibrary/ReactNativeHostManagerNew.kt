package com.asavault.rnbrownfieldlibrary // If you used a different package name when creating the library, change it here

import android.app.Application
import com.callstack.reactnativebrownfield.OnJSBundleLoaded
import com.callstack.reactnativebrownfield.ReactNativeBrownfield
import com.facebook.react.PackageList


object ReactNativeHostManagerNew {
    fun initialize(application: Application, onJSBundleLoaded: OnJSBundleLoaded? = null) {
        val packageList = PackageList(application).packages
        ReactNativeBrownfield.initialize(application, packageList, onJSBundleLoaded)
    }
}