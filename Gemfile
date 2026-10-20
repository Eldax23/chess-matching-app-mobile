source 'https://rubygems.org'

# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby ">= 2.6.10"

# CocoaPods 1.15+ is incompatible with React Native 0.73's pod scripts
gem 'cocoapods', '>= 1.13', '< 1.15'
gem 'activesupport', '>= 6.1.7.5', '< 7.1.0'
gem 'xcodeproj', '< 1.26.0'
# Newer concurrent-ruby breaks the activesupport/cocoapods pair above
gem 'concurrent-ruby', '< 1.3.4'
# json 3 rejects the quirks_mode option that activesupport 7.0 passes to JSON.generate
gem 'json', '< 3'
