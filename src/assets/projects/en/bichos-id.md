---
title: BichosID
date: 2024
url: https://apps.apple.com/us/app/bichos-id/id6689492259
github: https://github.com/cesargdm/bichos-id
description: AI-powered insect identification app for iOS that helps users identify bugs, butterflies, and spiders instantly.
tags: [ios, swift, ai, coreml, vision, machine-learning]
---

# BichosID

BichosID is an iOS application that leverages artificial intelligence to help users identify insects, bugs, butterflies, and spiders through photo recognition. The app bridges the gap between curiosity and knowledge, making entomology accessible to everyone.

You can download it from the [App Store](https://apps.apple.com/us/app/bichos-id/id6689492259) and view the source code on [GitHub](https://github.com/cesargdm/bichos-id).

## The Vision

After observing how many people struggle to identify insects they encounter in their daily lives, I decided to create an intuitive solution that puts the power of instant insect identification right in their pocket. Whether you're a gardener dealing with pests, a parent helping curious kids, or simply someone fascinated by the natural world, BichosID provides immediate answers.

The inspiration came from countless moments when I found myself wondering about mysterious insects in my garden. Existing solutions were either too complex for casual users or lacked the accuracy needed for reliable identification. I wanted to create something that could instantly satisfy that universal curiosity we all have about the natural world around us.

## Technical Implementation

The app is built natively for iOS using Swift, taking full advantage of Apple's ecosystem and modern development practices. At its core, BichosID uses Core ML for machine learning models that enable accurate insect classification with on-device inference, ensuring both privacy and speed. The Vision Framework handles sophisticated image processing and feature extraction, while AVFoundation manages real-time camera functionality and photo capture.

For data management, I implemented Core Data to provide robust local storage for user collections, identification history, and offline functionality. The user interface is built with SwiftUI, delivering a modern and responsive experience with smooth animations and accessibility support. Combine helps manage reactive programming patterns for handling async operations and data flow throughout the app.

The machine learning pipeline involved several key phases: curating a comprehensive dataset of insect images from various sources, ensuring diverse representation across species and environments. I utilized transfer learning with a pre-trained image classification model, fine-tuned specifically for insect recognition. The model architecture balances accuracy with mobile performance constraints.

Converting the trained model to Core ML format with quantization and optimization for mobile deployment was crucial for ensuring fast inference while maintaining accuracy. I also implemented feedback mechanisms to continuously improve model accuracy based on user interactions and validation results.

## Development Challenges

Building BichosID presented several interesting technical challenges. Many insect species share similar visual characteristics, requiring sophisticated feature extraction to differentiate between closely related species. Users capture photos in various lighting conditions, angles, and distances, so the app needed to handle everything from macro photography to blurry snapshots.

Balancing model complexity with mobile performance requirements while ensuring the app remains responsive and doesn't drain battery life was another significant challenge. I also had to ensure the app works reliably without internet connectivity, which meant implementing efficient local storage and on-device AI inference.

## Key Features

The app includes instant AI recognition using advanced Core ML models and Vision framework, allowing users to identify thousands of insect species with high accuracy by simply taking a photo or uploading one from the gallery. Each identified species comes with comprehensive information including scientific and common names, habitat and distribution details, behavioral characteristics, and whether the insect is beneficial or harmful.

The user interface is designed with simplicity in mind, featuring an intuitive camera interface that makes identification as easy as pointing and shooting. Users can save their discoveries and build their own digital insect collection, perfect for tracking finds during nature walks or garden monitoring.

## Impact and Reception

Since its launch on the App Store, BichosID has helped countless users satisfy their curiosity about the insect world around them. The app has proven particularly valuable for educators using it as a teaching tool in biology classes, gardeners identifying beneficial insects versus pests, nature enthusiasts exploring biodiversity in their local areas, and parents answering their children's questions about bugs.

## Lessons Learned

Developing BichosID taught me valuable lessons about mobile AI development, particularly the importance of designing for real-world usage scenarios rather than ideal conditions. Users don't always have perfect lighting or steady hands. Implementing on-device machine learning not only improves privacy but also provides faster responses and works offline, significantly enhancing user experience.

Building feedback loops into the app architecture from day one allows for continuous model improvement based on real user data. While focusing on iOS first allowed for deeper platform integration, planning for future Android development influenced many architectural decisions.

## Future Development

The roadmap for BichosID includes several exciting enhancements. I'm working on expanding the model to better recognize insects specific to different geographical regions, starting with common species in Latin America and North America. Implementing AR capabilities will provide real-time identification overlays when pointing the camera at insects in their natural habitat.

I also plan to add user-generated content capabilities where experienced entomologists can contribute to species verification and additional information. Integrating interactive learning modules about insect biology, ecology, and conservation will transform the app from a simple identifier to a comprehensive educational tool.

The [GitHub repository](https://github.com/cesargdm/bichos-id) serves as a learning resource for developers interested in mobile AI applications. The codebase demonstrates practical implementations of Core ML integration, camera handling, and user interface design patterns for scientific applications.

BichosID represents the perfect blend of technology and nature education, making the fascinating world of insects accessible to everyone with just a smartphone camera. It's a testament to how mobile AI can democratize scientific knowledge and foster curiosity about the natural world around us.