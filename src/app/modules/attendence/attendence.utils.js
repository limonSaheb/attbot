import discordClient from "../../utlis/discordClient"

const createAttendenceThread = async()=>{
    const getChannel = await discordClient.channels.fetch()
}

export default AttendenceUtils = {
    createAttendenceThread
}