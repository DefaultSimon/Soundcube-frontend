#!/usr/bin/env bash

# ---------------
# React production builder
# ---------------

# Remove previous build
rm -rf build/*

# Make warnings stop the build
CI=true
# Don't generate sourcemaps
GENERATE_SOURCEMAP=false

# Run the production build
npm run build