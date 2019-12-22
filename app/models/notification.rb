require 'net/http'
require 'jsonapi-resources'

class Notification < ApplicationRecord
	def test
		puts 'This is a test.'
	end

	def send_notification(title, content)
        params = {"app_id" => "b290fd9a-eedf-44b0-8bfd-6a37646957b6", 
                  "headings" => {"en" => title},
		          "contents" => {"en" => content},
                #   "included_segments" => ["All"],
                "include_player_ids" => ['08751c80-ab03-4fee-9480-1089e7e5ec4b']                
                }
		uri = URI.parse('https://onesignal.com/api/v1/notifications')
		http = Net::HTTP.new(uri.host, uri.port)
		http.use_ssl = true
		request = Net::HTTP::Post.new(uri.path,
		    'Content-Type'  => 'application/json;charset=utf-8',
		    'Authorization' => "Basic NDY3ZjU0NTktZTUwNy00ODQyLWFmNTMtN2IzYjAyZjI5MGYx")
		request.body = params.as_json.to_json
		response = http.request(request)
		puts response.body
	end
end