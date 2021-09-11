/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import "antd/dist/antd.css";
import { Card, Table, Button, Form, Input, InputNumber, Upload, Select, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { axiosWithAuth } from 'lib/auth';

import Moment from 'react-moment';
import Big from "big.js";
import { useProducts, useAuth } from "context/hooks";
import { useInterval } from "hooks/useInterval";

const { Option } = Select;

const PurchaseForm = () => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState({});
  const [form] = Form.useForm();

  const cur_list = {
    "₿": 1,
    "Ξ": 2,
    "ꜩ": 3
  };

  const cur_display = []
  for (let curr in cur_list) {
    cur_display.push(<Option value={curr}>{curr}</Option>);
  }

  function handleChange(value = 0) {
    setRate(value);
  }

  const onPurchase = async (values) => {
    setLoading(true);
    form.resetFields();
    setRate(null);
    const update = {};
    if (owned !== {}){
      Object.assign(update, owned);
    }
    if (!update.hasOwnProperty(`${values.crypto}`)){
      update[values.crypto] = 0;
    }
    update[values.crypto] += Number(values.amount);
    setOwned(update);
    message.success("Purchase Successful.")
    setLoading(false);
  };
  const onPurchaseFailed = () => {};

  return (
    <Form
    css={{
      height: "100%",
      width: "30%"
    }}
    layout="inline"
    onFinish={onPurchase}
    onFinishFailed={onPurchaseFailed}
    form={form}
    >
      <Form.Item
        name="crypto"
        id="crypto"
        rules={[{ required: true, message: "Please select currency" }]}
        label="Crypto"
      >
        <Select style={{ width: 90 }} tokenSeparators={[","]} onChange={handleChange}>
          {cur_display}
        </Select>
      </Form.Item>
      <Form.Item
        name="amount"
        id="amount"
        rules={[{ required: true, message: "Please input a valid amount" }]}
        label="Amount"
      >
        <InputNumber
          css={{width: "50%"}}
          defaultValue="0"
          min="0"
          step="0.00000001"
          stringMode
        />
      </Form.Item>
      <Form.Item
        name="rate"
        id="rate"
        label="Rate"
      >
        {cur_list[rate]}
      </Form.Item>
      <Button
        type="default"
        size="small"
        htmlType="submit"
      >
      Confirm
      </Button>
    </Form>
  );
};

const LiquidForm = () => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState({});
  const [form] = Form.useForm();

  const cur_list = {
    "₿": 1,
    "Ξ": 2,
    "ꜩ": 3
  };

  const baseline = {
    "₿": 600,
    "Ξ": 200
  };

  const cur_display = []
  for (let key in baseline) {
    cur_display.push(<Option value={key}>{key}</Option>);
  }

  function handleChange(value = 0) {
    setRate(value);
  }

  const onLiquid = async (values) => {
    setLoading(true);
    form.resetFields();
    setRate(null);
    const update = {};
    Object.assign(update, baseline);
    if (values.amount > update[values.crypto]){
      // message.failure("Exceeded owned monetary ceiling.")
      setLoading(false);
    } else {
      update[values.crypto] -= Number(values.amount);
      message.success("Liquidation Successful.")
      setLoading(false);
      setOwned(update);
    }
  };
  const onLiquidFailed = () => {};

  return (
    <Form
    css={{
      height: "100%",
      width: "30%"
    }}
    layout="inline"
    onFinish={onLiquid}
    onFinishFailed={onLiquidFailed}
    form={form}
    >
      <Form.Item
        name="crypto"
        id="crypto"
        rules={[{ required: true, message: "Please select currency" }]}
        label="Crypto"
      >
        <Select style={{ width: 90 }} tokenSeparators={[","]} onChange={handleChange}>
          {cur_display}
        </Select>
      </Form.Item>
      <Form.Item
        name="amount"
        id="amount"
        rules={[{ required: true, message: "Please input a valid amount" }]}
        label="Amount"
      >
        <InputNumber
          css={{width: "50%"}}
          defaultValue="0"
          min="0"
          step="0.00000001"
          stringMode
        />
      </Form.Item>
      <Form.Item
        name="rate"
        id="rate"
        label="Rate"
      >
        {cur_list[rate]}
      </Form.Item>
      <Button
        type="default"
        size="small"
        htmlType="submit"
      >
      Confirm
      </Button>
    </Form>
  );
};

const ExchangeForm = () => {

  return (
    <Form
    css={{
      height: "100%",
    }}
    bodyStyle={{
      alignItems: "center"
    }}
    layout="inline"
    >
      <Form.Item
        name="name"
        id="name"
        label="Owned Crypto"
      >
        <Input style={{ width: 130 }} />
      </Form.Item>
      <Form.Item
        name="e-r"
        id="e-r"
        label="Conversion"
      >
        <Input style={{ width: 50 }} />
      </Form.Item>
      <Form.Item
        name="desired"
        id="desired"
        label="Desired Crypto"
      >
        <Input style={{ width: 130 }} />
      </Form.Item>
      ____________________
      <Form.Item
        name="rate1"
        id="rate1"
        label="Rate"
      >
        <Input style={{ width: 50 }} />
      </Form.Item>
___________________________________________
      <Form.Item
        name="rate2"
        id="rate2"
        label="Rate"
      >
        <Input style={{ width: 50 }} />
      </Form.Item>
      _____
      <Form.Item
        name="amount1"
        id="amount1"
        label="Amount"
      >
        <InputNumber
          css={{width: "50%"}}
          defaultValue="0"
          min="0"
          step="0.00000001"
          stringMode
        />
      </Form.Item>
      _____
      <Form.Item
        name="amount2"
        id="amount2"
        label="Amount"
      >
        <InputNumber
          css={{width: "50%"}}
          defaultValue="0"
          min="0"
          step="0.00000001"
          stringMode
        />
      </Form.Item>
      <Button
        type="default"
        size="small"
      >
      Confirm
      </Button>
    </Form>
  );
};

export const Liquidation = () => {
  return (
    <>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 3fr 0",
          gridTemplateRows: 350,
          alignItems: "center",
          gap: "1em",
        }}
      >
        <Card
          css={{
            height: "100%",
          }}
          bodyStyle={{
            height: "100%",
            textAlign: "left",
            alignItems: "center"
          }}
          title="Purchase"
        >
          <PurchaseForm />
        </Card>
        <Card
          css={{
            height: "100%",
          }}
          bodyStyle={{
            height: "100%",
            textAlign: "left",
            alignItems: "center"
          }}
          title="Liquidate"
        >
          <LiquidForm />
        </Card>
        <Card
          css={{
            height: "100%",
          }}
          bodyStyle={{
            height: "100%",
            textAlign: "left",
            alignItems: "center"
          }}
          title="Exchange"
        >
          <ExchangeForm />
        </Card>
      </div>
      <Card bodyStyle={{ padding: 0 }} title="Crypto Currencies">
      </Card>
    </>
  );
};
