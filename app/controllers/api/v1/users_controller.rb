class Api::V1::UsersController < ApiController
  before_action :set_user

  def show
  end

  def index
  end

  # purpose - checks if users' session is still live
  # GET /api/v1/user/session
  def timeout
    if current_user
      render json: { message: 'User logged in.', status: true }
    else
      render json: { message: 'User not logged in.', status: false }
    end
  end

  # POST /api/v1/users
  def create
    validate_params
    if User.find_by_email(params[:email])
      return render json: { status: 'ERROR', message: 'User already created' }, status: :unprocessable_entity
    end
    @user = User.create!(
      name: params[:name],
      email: params[:email],
      phone: params[:phone],
      password: params[:password],
      password_confirmation: params[:password_confirmation],
      team_id: params[:team_id],
    )
    @team = @user.team
    if @user.save
      bypass_sign_in @user

      data = format_user_data({
          user: @user.as_json,
          team: @team.as_json,
          captain: @team.captain,
        })

      render json: { status: 'SUCCESS', message: 'User saved and signed in', data: data }, status: :ok
    else
      render json: { status: 'ERROR', message: 'User not saved', data: @user.errors }, status: :unprocessable_entity
    end
  end

  # POST /login
  def login
    validate_login_params
    @user = User.find_by_email(params[:email])
    if @user&.valid_password?(params[:password])
      @user.remember_me = true
      bypass_sign_in @user
      @team = @user.team
      if current_user
        # setting up data
        data = format_user_data({
            user: @user.as_json,
            team: @team.as_json,
            captain: @team.captain,
          })

        render json: { status: 'SUCCESS', message: 'User Logged In', data: data  }, status: :ok
      else
        render json: { status: 'ERROR', message: 'Error while Logging In' }, status: :unauthorized
      end
    else
      render json: { status: 'ERROR', message: 'Incorrect Email or Password' }, status: :unauthorized
    end
  end

  # POST /logout
  def logout
    sign_out current_user
    if !current_user
      render json: { status: 'SUCCESS', message: 'User Logged Out' }, status: :ok
    else
      render json: { status: 'ERROR', message: 'Error while Logging Out' }, status: :unauthorized
    end
  end

  # POST /api/v1/user/token_reset_password
  # Change user password using reset token
  def token_reset_password
    validate_reset_token_password_params

    @user = User.reset_password_by_token(@reset_params)

    if @user.errors.empty?
        render json: { status: 'SUCCESS', message: 'Password has xpbeen reset.', email: params[:user_email]}, status: :ok
      else
        render json: { status: 'ERROR', data: @user.errors, message: 'Server error prevented password from being reset.' }, status: :not_found
      end
  end

  # POST /api/v1/user/forgot_password
  # Initiate password reset process
  def forgot_password
    validate_forgot_password_params

    # Check if valid email that is registered to an GTHC account
    @user = User.find_by_email(params[:user_email]);
    if @user
      @output = edit_password_url(@user, reset_password_token: '123')
      puts 'test124'
      puts @output
      @user.send_reset_password_instructions

      if @user.errors.empty?
        render json: { status: 'SUCCESS', message: 'Password reset sent.', email: params[:user_email]}, status: :ok
      else
        render json: { status: 'ERROR', message: 'Server error prevented email from being sent.' }, status: :not_found
      end
    else
      render json: { status: 'ERROR', message: 'There is no user associated with that email.' }, status: :not_found
    end
  end

  # POST /api/v1/user/shifts
  # Add user to shift, and vice versa
  def shifts
    puts Visits.last
    validate_shift_params
    if Shift.all.ids.include? @s_id and User.all.ids.include? @u_id
      @user = User.find(@u_id)
      @shift = Shift.find(@s_id)
      if @shift.team_id == @user.team_id
        @user.shifts <<  @shift
        data = {
          user_shifts: current_user.shifts,
          team_shifts: current_user.team.shifts,
        }
        render json: { status: 'SUCCESS', message: 'User added to Shift successfully.', data: data }, status: :ok
      else
        render json: { status: 'ERROR', message: 'Shift and User must be the same team.' }, status: :unprocessable_entity
      end
    else
      render json: { status: 'ERROR', message: 'Shift and/or User not found.' }, status: :not_found
    end
  end

  # PUT/PATCH /api/v1/user/:id
  def update
    if params[:password]
      validate_params_update_with_password
    else
      validate_params_update
    end
    if user = User.find(params[:id])
      user.update(@prime_params)

      # this is needed because Devise signs out a user if update() is called
      if params[:password]
        bypass_sign_in user
      end
      render json: { status: 'SUCCESS', message: 'User successfully updated.', data: user }, staus: :ok
    else
      render json: { status: 'ERROR', message: 'User not found' }, status: :not_found
    end
  end

  # PUT /api/v1/user/password/check
  # purpose - checks users password on the user setting page
  def password_check
    validate_params_password_check
    if current_user.valid_password? params[:password]
      render json: { message: 'Correct Password', check: true }, status: :ok
    else
      render json: { message: 'Incorrect Password', check: false }, status: :ok
    end
  end

  # POST /api/v1/user/avatar
  def update_avatar
    validate_avatar_params
    current_user.avatar.attach(params[:avatarFile])
    if current_user.avatar.attached?
      render json: { status: 'SUCCESS', message: 'User avatar updated successfully', data: url_for(current_user.avatar) }, status: :ok
    else
      render json: { status: 'ERROR', message: 'User avatar not updated.' }, status: :unprocessable_entity
    end
  end

  private

    def set_user
      if params[:id]
        @user = User.find(params[:id])
      else
        @Users = User.all
      end
    end

    def validate_forgot_password_params
      params.require([:user_email])
    end

    def validate_login_params
      params.require([:email, :password])
    end

    def validate_params
      params.require([:name,
                      :email,
                      :phone,
                      :password,
                      :password_confirmation,
                      :team_id])
    end

    def validate_shift_params
      params.require([:shift_id, :user_id])
      @s_id = params[:shift_id].to_i
      @u_id = params[:user_id].to_i
    end

    def validate_params_update
      params.require([:name, :phone]);
      @prime_params = {
        name: params[:name],
        phone: params[:phone],
      }
    end

    def validate_reset_token_password_params
        params.require([:password, :password_confirmation, :token])
        @reset_params = {
          reset_password_token: params[:token],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        }
    end

    def validate_params_update_with_password
        params.require([:password, :password_confirmation])
        @prime_params = {
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        }
    end

    def validate_params_password_check
      params.require([:password])
    end

    def validate_avatar_params
      params.require(:avatarFile)
    end
end
