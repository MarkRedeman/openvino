#include <napi.h>


#include "compiled_model.hpp"
#include "core_wrap.hpp"
#include "infer_request.hpp"
#include "model_wrap.hpp"
#include "pre_post_process_wrap.hpp"
#include "tensor.hpp"
#include "element_type.hpp"
#include "session.hpp"
#include "shape_lite.hpp"

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

/// @brief Initialize native add-on
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    ModelWrap::Init(env, exports);
    CoreWrap::Init(env, exports);
    CompiledModelWrap::Init(env, exports);
    InferRequestWrap::Init(env, exports);
    TensorWrap::Init(env, exports);
    ShapeLite::Init(env, exports);
    Session::Init(env, exports);
    PrePostProcessorWrap::Init(env, exports);
    Napi::PropertyDescriptor element = Napi::PropertyDescriptor::Accessor<enumElementType>("element");
    exports.DefineProperty(element);

    exports.Set(Napi::String::New(env, "getDescriptionString"),
              Napi::Function::New(env, Method));

    return exports;
}

/// @brief Register and initialize native add-on
NODE_API_MODULE(addon_openvino, InitAll)
