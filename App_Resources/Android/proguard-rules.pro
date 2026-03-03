# Keep desugar JDK classes required for Java 8+ backports
-keep class j$.* { *; }
-dontwarn j$.**

# Since NS runtime and generated delegates might use reflection
-keep class com.tns.** { *; }

# Receiver and package
-keep class es.uji.geotec.contextapis.** { *; }
