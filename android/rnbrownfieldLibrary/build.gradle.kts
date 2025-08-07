
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    id("com.facebook.react")
    id("com.callstack.react.brownfield")
    `maven-publish`

}

react {
    autolinkLibrariesWithApp()
}

android {
    namespace = "com.asavault.rnbrownfieldlibrary"
    compileSdk = 35

    defaultConfig {
        minSdk = 24

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")

        buildConfigField("boolean", "IS_NEW_ARCHITECTURE_ENABLED", properties["newArchEnabled"].toString())
        buildConfigField("boolean", "IS_HERMES_ENABLED", properties["hermesEnabled"].toString())
    }

    // Fix duplicate resources
    androidResources {
        ignoreAssetsPatterns += listOf("**/values/values.xml", "**/values-*/values.xml")
    }
    
    packaging {
        resources {
            excludes +="**/values/values.xml"
            excludes +="**/res/values/values.xml"
            excludes += "**/values-*/values.xml"
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {

    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("com.google.android.material:material:1.12.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    api("com.facebook.react:react-android:0.77.2")
    api("com.facebook.react:hermes-android:0.77.2")
}


afterEvaluate {
    publishing {
        publications {
            create<MavenPublication>("mavenAar") {
                groupId = "com.callstack"
                artifactId = "rnbrownfield"
                version = "0.0.15-local"
                from(components.getByName("release"))

                pom {
                    withXml {
                        /**
                         * As a result of `from components.getByName("release")` all of the project
                         * dependencies are added to `pom.xml` file. We do not need the react-native
                         * third party dependencies to be a part of it as we embed those dependencies.
                         */
                        val dependenciesNode = (asNode().get("dependencies") as groovy.util.NodeList).first() as groovy.util.Node
                        dependenciesNode.children()
                            .filterIsInstance<groovy.util.Node>()
                            .filter { (it.get("groupId") as groovy.util.NodeList).text() == rootProject.name }
                            .forEach { dependenciesNode.remove(it) }
                    }
                }
            }
        }

        repositories {
            mavenLocal() // Publishes to the local Maven repository (~/.m2/repository by default)
        }
    }
    
    // Fix task dependencies for source JAR generation
    tasks.named("releaseSourcesJar") {
        dependsOn("copyAutolinkingSources")
        dependsOn("generateCodegenArtifactsFromSchema")
    }
    
    // Alternative: Disable source JAR generation if you don't need it
    // tasks.named("releaseSourcesJar").configure {
    //     enabled = false
    // }
}

val moduleBuildDir: Directory = layout.buildDirectory.get()

/**
 * As a result of `from components.getByName("default")` all of the project
 * dependencies are added to `module.json` file. We do not need the react-native
 * third party dependencies to be a part of it as we embed those dependencies.
 */
tasks.register("removeDependenciesFromModuleFile") {
    doLast {
        file("$moduleBuildDir/publications/mavenAar/module.json").run {
            val json = inputStream().use { JsonSlurper().parse(it) as Map<String, Any> }
            (json["variants"] as? List<MutableMap<String, Any>>)?.forEach { variant ->
                (variant["dependencies"] as? MutableList<Map<String, Any>>)?.removeAll { it["group"] == rootProject.name }
            }
            writer().use { it.write(JsonOutput.prettyPrint(JsonOutput.toJson(json))) }
        }
    }
}

afterEvaluate {
    tasks.named("generateMetadataFileForMavenAarPublication") {
       finalizedBy("removeDependenciesFromModuleFile")
    }
}