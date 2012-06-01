require 'sinatra'
require 'json'
require 'sqlite3'

class Voter < Sinatra::Application

	configure do
		set :db, SQLite3::Database.new( "votes.db" )
		settings.db.execute "CREATE TABLE IF NOT EXISTS votes (filename TEXT, person TEXT, list TEXT)"

		set :people, [
			'',
			'20',
			'alex',
			'bog',
			'chris',
			'christian',
			'gavin',
			'george',
			'ken',
			'matthew'
		]
	end

	configure :production do
		set :songs_glob, '/home/ted/denver-music/*'
		set :music_url_base, 'http://temp.deanspot.org/denver-music/'
	end
	configure :development do
		set :songs_glob, '/Users/alex/Sites/denver-music/*'
		set :music_url_base, 'http://localhost/~alex/denver-music/'
	end

	before do
		content_type 'application/json', :charset=>'utf-8'
	end

	get '/songs' do
		Dir.glob(settings.songs_glob).to_json
	end

	get '/people' do
		settings.people.to_json
	end

	get '/list/:name' do
		current = {}
		settings.db.execute( "SELECT filename, person FROM votes WHERE list = ?", params[:name] ) do |row|
			current[row[0]] = row[1]
		end

		out = [];
		Dir.glob(settings.songs_glob).each do |file|
			basename = File.basename(file)
			out << {'song'=>basename, 'person'=>(current[basename] || '')}
		end
		out.to_json
	end

	get '/' do
		content_type 'text/html', :charset=>'utf-8'
		erb :index, :locals=>{:music_url_base=>settings.music_url_base}
	end

	post '/list/:name' do
		puts params.inspect
		settings.db.transaction do
			settings.db.execute "DELETE FROM votes WHERE list = ?", params[:name]
			params[:songs].each do |key,value|
				settings.db.execute "INSERT INTO votes (filename, person, list) VALUES (?, ?, ?)", value['song'], value['person'], params[:name]
			end
		end
		nil
	end

	post '/debug' do
		params.inspect
	end

end