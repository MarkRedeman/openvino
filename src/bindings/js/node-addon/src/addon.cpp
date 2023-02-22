#include <napi.h>


#include "CompiledModelWrap.hpp"
#include "CoreWrap.hpp"
#include "InferRequestWrap.hpp"
#include "ModelWrap.hpp"
#include "PrePostProcessorWrap.hpp"
#include "TensorWrap.hpp"
#include "element_type.hpp"

/// @brief Initialize native add-on
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    ModelWrap::Init(env, exports);
    CoreWrap::Init(env, exports);
    CompiledModelWrap::Init(env, exports);
    InferRequestWrap::Init(env, exports);
    TensorWrap::Init(env, exports);
    PrePostProcessorWrap::Init(env, exports);

    Napi::PropertyDescriptor element = Napi::PropertyDescriptor::Accessor<enumElementType>("element");
    exports.DefineProperty(element);

    return exports;
}

/// @brief Register and initialize native add-on
NODE_API_MODULE(addon_openvino, InitAll)
