import Image from "next/image"

const AboutPage = () => {
    return (
        <div className="sm:flex items-center justify-center max-w-screen-xl">
            <div className="sm:w-1/2 py-5 ">
                <Image src="/images/artia-logo.png" alt="About" width={1920} height={1080} className="max-w-96 mx-auto mt-5" />
            </div>
            <div className="sm:w-1/2 p-5">
                <div className="text">
                    <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">About us</span>
                    <h2 className="my-4 font-bold text-3xl  sm:text-4xl ">About <span className="text-indigo-600">Our Company</span>
                    </h2>
                    <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, commodi
                        doloremque, fugiat illum magni minus nisi nulla numquam obcaecati placeat quia, repellat tempore
                        voluptatum.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutPage