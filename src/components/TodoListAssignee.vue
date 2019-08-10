<template>
  <div class="TodosAssignee">
    <IconUser class="user" />

    <select
      class="select"
      :class="{ selected: !!todo.assignee }"
      @change="update"
    >
      <option class="option" value="">Choose assignee</option>
      <option
        class="option"
        :value="user.id"
        :selected="todo.user_id == user.id"
        :key="user.id"
        v-for="user in users"
      >
        {{ user.name }}
      </option>
    </select>

    <IconChevronDown class="down" />
  </div>
</template>

<script>
import User from "@/models/User";
import Todo from "@/models/Todo";
import IconUser from "./icons/IconUser";
import IconChevronDown from "./icons/IconChevronDown";

export default {
  components: {
    IconUser,
    IconChevronDown
  },

  props: {
    todoId: { type: Number, required: true }
  },

  computed: {
    users() {
      return User.query()
        .orderBy("name")
        .get();
    },

    todo() {
      return (
        Todo.query()
          .with("assignee")
          .find(this.todoId) || {}
      );
    }
  },

  methods: {
    update(e) {
      Todo.update({
        id: this.todoId,
        user_id: e.target.value
      });
    }
  }
};
</script>

<style scoped>
.TodosAssignee {
  position: relative;
  display: flex;
  align-items: center;
}

.user {
  width: 14px;
  height: 14px;
}

.select {
  position: relative;
  z-index: 1;
  border: 0;
  padding-right: 16px;
  padding-left: 12px;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.down {
  position: absolute;
  top: 10px;
  right: 0;
  width: 8px;
  height: 8px;
}
</style>
