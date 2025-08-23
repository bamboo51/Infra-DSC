const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100 rounded-full filter blur-xl opacity-50"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full filter blur-xl opacity-50"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-50 rounded-full filter blur-xl opacity-30"></div>
  </div>
);

export default BackgroundBlobs;