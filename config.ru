require './voter.rb'

use Rack::ShowExceptions

run Voter.new

