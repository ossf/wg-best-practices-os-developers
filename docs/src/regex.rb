#!/usr/bin/env ruby

puts('Test Ruby regex')
puts("Must be false: ", !! /^wrong$/.match("hello"))
puts("Must be true: ", !! /^hello$/.match("hello"))
puts("True if permissive: ", !! /^hello$/.match("hello\n"))
puts("Should be true ($ always multi): ", !! /^hello$/.match("hello\nthere"))
