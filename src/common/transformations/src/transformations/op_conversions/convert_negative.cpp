// Copyright (C) 2018-2023 Intel Corporation
// SPDX-License-Identifier: Apache-2.0
//

#include "transformations/op_conversions/convert_negative.hpp"

#include <memory>
#include <ngraph/pattern/op/wrap_type.hpp>
#include <ngraph/rt_info.hpp>
#include <vector>

#include "itt.hpp"
#include "openvino/op/constant.hpp"
#include "openvino/op/multiply.hpp"
#include "openvino/op/negative.hpp"

ov::pass::ConvertNegative::ConvertNegative() {
    MATCHER_SCOPE(ConvertNegative);
    auto neg = ngraph::pattern::wrap_type<ov::op::v0::Negative>();

    matcher_pass_callback callback = [](pattern::Matcher& m) {
        auto neg = std::dynamic_pointer_cast<ov::op::v0::Negative>(m.get_match_root());
        if (!neg) {
            return false;
        }

        auto mul = std::make_shared<ov::op::v1::Multiply>(
            neg->input(0).get_source_output(),
            ov::op::v0::Constant::create(neg->get_element_type(), Shape{}, {-1}));
        mul->set_friendly_name(neg->get_friendly_name());
        ngraph::copy_runtime_info(neg, mul);
        ngraph::replace_node(neg, mul);
        return true;
    };

    auto m = std::make_shared<ngraph::pattern::Matcher>(neg, matcher_name);
    this->register_matcher(m, callback);
}
